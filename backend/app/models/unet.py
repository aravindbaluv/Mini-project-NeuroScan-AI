"""
=============================================================================
PyTorch U-Net Architecture for Brain Tumor MRI Segmentation & Classification
BraTS Sub-Compartments (Necrotic Core, Enhancing Rim, Peritumoral Edema)
=============================================================================
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class DoubleConv(nn.Module):
    """(Conv2D -> BatchNorm -> ReLU) * 2"""

    def __init__(self, in_channels: int, out_channels: int, mid_channels: int = None):
        super(DoubleConv, self).__init__()
        if not mid_channels:
            mid_channels = out_channels
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, mid_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(mid_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(mid_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.double_conv(x)


class Down(nn.Module):
    """Downscaling with MaxPool2D then DoubleConv"""

    def __init__(self, in_channels: int, out_channels: int):
        super(Down, self).__init__()
        self.maxpool_conv = nn.Sequential(
            nn.MaxPool2d(2),
            DoubleConv(in_channels, out_channels)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.maxpool_conv(x)


class Up(nn.Module):
    """Upscaling with Bilinear Interpolation or Transposed Conv then DoubleConv"""

    def __init__(self, in_channels: int, out_channels: int, bilinear: bool = True):
        super(Up, self).__init__()

        if bilinear:
            self.up = nn.Upsample(scale_factor=2, mode="bilinear", align_corners=True)
            self.conv = DoubleConv(in_channels, out_channels, in_channels // 2)
        else:
            self.up = nn.ConvTranspose2d(in_channels, in_channels // 2, kernel_size=2, stride=2)
            self.conv = DoubleConv(in_channels, out_channels)

    def forward(self, x1: torch.Tensor, x2: torch.Tensor) -> torch.Tensor:
        x1 = self.up(x1)
        # Input tensor sizing difference handling (padding if needed)
        diffY = x2.size()[2] - x1.size()[2]
        diffX = x2.size()[3] - x1.size()[3]

        x1 = F.pad(x1, [diffX // 2, diffX - diffX // 2, diffY // 2, diffY - diffY // 2])
        x = torch.cat([x2, x1], dim=1)
        return self.conv(x)


class UNetBrainTumor(nn.Module):
    """
    Dual-Task U-Net Architecture:
    1. Volumetric Sub-Compartment Segmentation (Necrotic Core, Enhancing Rim, Edema)
    2. Multi-Class Neoplasm Classification (Glioma, Meningioma, Pituitary, Normal)
    """

    def __init__(
        self,
        in_channels: int = 1,
        num_seg_classes: int = 4,
        num_diag_classes: int = 4,
        bilinear: bool = True
    ):
        super(UNetBrainTumor, self).__init__()
        self.in_channels = in_channels
        self.num_seg_classes = num_seg_classes
        self.num_diag_classes = num_diag_classes
        self.bilinear = bilinear

        # --- Encoder (Feature Extraction) ---
        self.inc = DoubleConv(in_channels, 64)
        self.down1 = Down(64, 128)
        self.down2 = Down(128, 256)
        self.down3 = Down(256, 512)
        factor = 2 if bilinear else 1
        self.down4 = Down(512, 1024 // factor)  # Bottleneck layer (Target for Grad-CAM)

        # --- Decoder (Segmentation Mask Reconstruction) ---
        self.up1 = Up(1024, 512 // factor, bilinear)
        self.up2 = Up(512, 256 // factor, bilinear)
        self.up3 = Up(256, 128 // factor, bilinear)
        self.up4 = Up(128, 64, bilinear)
        self.outc = nn.Conv2d(64, num_seg_classes, kernel_size=1)

        # --- Classification Head (Branch from Bottleneck) ---
        self.global_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.classifier = nn.Sequential(
            nn.Linear(1024 // factor, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),
            nn.Linear(256, num_diag_classes)
        )

    def forward(self, x: torch.Tensor):
        # Encoder
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        x4 = self.down3(x3)
        x5 = self.down4(x4)  # Bottleneck activations

        # Segmentation Decoder
        x_dec = self.up1(x5, x4)
        x_dec = self.up2(x_dec, x3)
        x_dec = self.up3(x_dec, x2)
        x_dec = self.up4(x_dec, x1)
        seg_logits = self.outc(x_dec)

        # Classification Head
        pooled = self.global_pool(x5)
        flattened = torch.flatten(pooled, 1)
        diag_logits = self.classifier(flattened)

        return seg_logits, diag_logits

    def get_target_layer_for_gradcam(self) -> nn.Module:
        """Returns the bottleneck double_conv layer for visual feature activation mapping"""
        return self.down4.maxpool_conv[1]
