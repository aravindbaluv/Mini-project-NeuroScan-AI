"""
=============================================================================
PyTorch Grad-CAM (Gradient-Weighted Class Activation Mapping) Implementation
Explainable AI (XAI) for Neuro-Oncology MRI Diagnostics
=============================================================================
"""

import cv2
import numpy as np
import torch
import torch.nn.functional as F


class GradCAM:
    """
    Gradient-Weighted Class Activation Mapping (Grad-CAM)
    Produces visual explanations highlighting the discriminative regions
    in MRI brain scans that dictate the neural network's decision.
    """

    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        # Register forward and backward hooks on the target convolutional layer
        self.forward_handle = self.target_layer.register_forward_hook(self._save_activations)
        self.backward_handle = self.target_layer.register_full_backward_hook(self._save_gradients)

    def _save_activations(self, module, input, output):
        self.activations = output.detach()

    def _save_gradients(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate_cam(
        self,
        input_tensor: torch.Tensor,
        target_class_idx: int = None
    ) -> np.ndarray:
        """
        Computes the Grad-CAM heatmap for a given input tensor and target class index.

        Args:
            input_tensor: (1, C, H, W) torch tensor
            target_class_idx: Integer target class index (e.g. 0=Glioma, 1=Meningioma, etc.)

        Returns:
            heatmap: (H, W) numpy float array in [0.0, 1.0]
        """
        self.model.eval()
        self.model.zero_grad()

        # Forward pass (dual task outputs)
        seg_logits, class_logits = self.model(input_tensor)

        if target_class_idx is None:
            target_class_idx = torch.argmax(class_logits, dim=1).item()

        # Backpropagation target: Score for class c
        one_hot = torch.zeros_like(class_logits)
        one_hot[0, target_class_idx] = 1.0

        class_logits.backward(gradient=one_hot, retain_graph=True)

        # 1. Global Average Pooling of gradients to obtain neuron importance weights alpha_k
        # gradients shape: (1, channels, h, w)
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)  # (1, C, 1, 1)

        # 2. Weighted combination of activation maps
        cam = torch.sum(weights * self.activations, dim=1, keepdim=True)  # (1, 1, h, w)

        # 3. Apply ReLU (we only care about features that have a positive influence)
        cam = F.relu(cam)

        # 4. Upsample to original image spatial resolution
        cam = F.interpolate(
            cam,
            size=(input_tensor.shape[2], input_tensor.shape[3]),
            mode="bilinear",
            align_corners=False
        )

        # 5. Normalize to [0, 1] range
        cam = cam.squeeze().cpu().numpy()
        cam_min, cam_max = np.min(cam), np.max(cam)
        if cam_max - cam_min > 1e-7:
            cam = (cam - cam_min) / (cam_max - cam_min)
        else:
            cam = np.zeros_like(cam)

        return cam

    def overlay_heatmap_on_image(
        self,
        original_image_grayscale: np.ndarray,
        heatmap: np.ndarray,
        alpha: float = 0.55,
        colormap: int = cv2.COLORMAP_JET
    ) -> np.ndarray:
        """
        Blends the Grad-CAM saliency heatmap onto the original MRI grayscale image.

        Args:
            original_image_grayscale: (H, W) uint8 in [0, 255]
            heatmap: (H, W) float in [0.0, 1.0]
            alpha: Heatmap blend opacity (0.0 to 1.0)
            colormap: OpenCV colormap (default: COLORMAP_JET)

        Returns:
            blended: (H, W, 3) uint8 BGR image
        """
        # Convert grayscale image to 3-channel BGR
        if len(original_image_grayscale.shape) == 2:
            base_bgr = cv2.cvtColor(original_image_grayscale, cv2.COLOR_GRAY2BGR)
        else:
            base_bgr = original_image_grayscale.copy()

        # Scale heatmap to uint8 [0, 255] and apply Jet color mapping
        heatmap_uint8 = np.uint8(255 * heatmap)
        heatmap_colored = cv2.applyColorMap(heatmap_uint8, colormap)

        # Blend
        blended = cv2.addWeighted(base_bgr, 1.0 - alpha, heatmap_colored, alpha, 0)
        return blended

    def release(self):
        """Removes registered hooks from PyTorch module"""
        self.forward_handle.remove()
        self.backward_handle.remove()
