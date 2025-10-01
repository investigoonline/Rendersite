import * as LucideIcons from "lucide-react";

// Helper to get icon component from icon name string
export function getIconComponent(iconName: string): React.ComponentType<any> | null {
  if (!iconName) return null;
  
  // LucideIcons is typed, so we need to cast to access properties dynamically
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (IconComponent) {
    return IconComponent;
  }
  
  console.warn(`Unknown icon name: ${iconName}, falling back to null`);
  return null;
}
