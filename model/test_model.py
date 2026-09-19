"""Verify that the ResNet18 ImageNet weights can be loaded."""

from torchvision.models import ResNet18_Weights, resnet18


def main():
    model = resnet18(weights=ResNet18_Weights.DEFAULT)
    parameter_count = sum(parameter.numel() for parameter in model.parameters())
    print("ResNet18 ImageNet weights loaded successfully.")
    print(f"Model parameter count: {parameter_count}")


if __name__ == "__main__":
    main()