import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UseFormReturn } from "react-hook-form";
import * as LucideIcons from "lucide-react";
import { iconOptions, colorOptions } from "@shared/contentSchemas";

interface ArrayFieldEditorProps {
  form: UseFormReturn<any>;
  fieldName: string;
  label: string;
  help?: string;
}

export function ArrayFieldEditor({ form, fieldName, label, help }: ArrayFieldEditorProps) {
  const values = form.watch(fieldName) || [];

  const addItem = () => {
    const newItem = getDefaultItemForField(fieldName);
    form.setValue(fieldName, [...values, newItem]);
  };

  const removeItem = (index: number) => {
    const newValues = values.filter((_: any, i: number) => i !== index);
    form.setValue(fieldName, newValues);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newValues = [...values];
    if (typeof newValues[index] === 'string') {
      // Simple string array
      newValues[index] = value;
    } else {
      // Object array
      newValues[index] = { ...newValues[index], [field]: value };
    }
    form.setValue(fieldName, newValues);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newValues = [...values];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newValues.length) {
      [newValues[index], newValues[newIndex]] = [newValues[newIndex], newValues[index]];
      form.setValue(fieldName, newValues);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Label className="text-base font-semibold">{label}</Label>
          {help && <p className="text-sm text-muted-foreground mt-1">{help}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          data-testid={`button-add-${fieldName}`}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {values.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No items yet. Click "Add Item" to get started.
          </div>
        )}
        
        {values.map((item: any, index: number) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">
                    Item {index + 1}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    data-testid={`button-move-up-${fieldName}-${index}`}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === values.length - 1}
                    data-testid={`button-move-down-${fieldName}-${index}`}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    data-testid={`button-remove-${fieldName}-${index}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {renderItemFields(fieldName, item, index, updateItem)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getDefaultItemForField(fieldName: string): any {
  // Stats items
  if (fieldName === 'stats') {
    return { label: '', value: '', description: '', icon: 'Target' };
  }
  
  // Process steps / Why choose reasons
  if (fieldName === 'steps' || fieldName === 'reasons' || fieldName === 'values') {
    return { title: '', description: '' };
  }
  
  // Commitments
  if (fieldName === 'commitments') {
    return { label: '', value: '' };
  }
  
  // Actions
  if (fieldName === 'actions') {
    return { icon: 'ArrowRight', label: '', href: '' };
  }
  
  // Benefits / Features / Content (simple string arrays)
  if (fieldName === 'benefits' || fieldName === 'features' || fieldName === 'content' || fieldName === 'calculators') {
    return '';
  }
  
  // Footer links
  if (fieldName === 'links') {
    return { label: '', href: '' };
  }
  
  // Categories
  if (fieldName === 'categories') {
    return { id: '', title: '', description: '', icon: 'Calculator', calculators: [] };
  }
  
  // Default to empty string
  return '';
}

function renderItemFields(
  fieldName: string,
  item: any,
  index: number,
  updateItem: (index: number, field: string, value: any) => void
) {
  // Simple string array (features, content, benefits, calculators)
  if (typeof item === 'string' || ['features', 'content', 'benefits', 'calculators'].includes(fieldName)) {
    const placeholders: Record<string, string> = {
      features: 'feature',
      content: 'content line',
      benefits: 'benefit',
      calculators: 'calculator name'
    };
    return (
      <div>
        <Input
          value={typeof item === 'string' ? item : ''}
          onChange={(e) => updateItem(index, '', e.target.value)}
          placeholder={`Enter ${placeholders[fieldName] || 'item'}`}
          data-testid={`input-${fieldName}-${index}`}
        />
      </div>
    );
  }

  // Stats items
  if (fieldName === 'stats') {
    return (
      <>
        <div>
          <Label className="text-sm">Label</Label>
          <Input
            value={item.label || ''}
            onChange={(e) => updateItem(index, 'label', e.target.value)}
            placeholder="e.g., Years of Excellence"
            data-testid={`input-${fieldName}-${index}-label`}
          />
        </div>
        <div>
          <Label className="text-sm">Value</Label>
          <Input
            value={item.value || ''}
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            placeholder="e.g., 40+"
            data-testid={`input-${fieldName}-${index}-value`}
          />
        </div>
        <div>
          <Label className="text-sm">Description</Label>
          <Textarea
            value={item.description || ''}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            placeholder="Brief description..."
            rows={2}
            data-testid={`textarea-${fieldName}-${index}-description`}
          />
        </div>
        <div>
          <Label className="text-sm">Icon</Label>
          <Select
            value={item.icon || 'Target'}
            onValueChange={(value) => updateItem(index, 'icon', value)}
          >
            <SelectTrigger data-testid={`select-${fieldName}-${index}-icon`}>
              <SelectValue>
                {item.icon && (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = (LucideIcons as any)[item.icon];
                      return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                    })()}
                    <span>{item.icon}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => {
                const IconComponent = (LucideIcons as any)[option.value];
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  }

  // Footer links
  if (fieldName === 'links') {
    return (
      <>
        <div>
          <Label className="text-sm">Label</Label>
          <Input
            value={item.label || ''}
            onChange={(e) => updateItem(index, 'label', e.target.value)}
            placeholder="e.g., About Us"
            data-testid={`input-${fieldName}-${index}-label`}
          />
        </div>
        <div>
          <Label className="text-sm">URL</Label>
          <Input
            value={item.href || ''}
            onChange={(e) => updateItem(index, 'href', e.target.value)}
            placeholder="e.g., /about"
            data-testid={`input-${fieldName}-${index}-href`}
          />
        </div>
      </>
    );
  }

  // Steps, Reasons, Values (title + description)
  if (fieldName === 'steps' || fieldName === 'reasons' || fieldName === 'values') {
    return (
      <>
        <div>
          <Label className="text-sm">Title</Label>
          <Input
            value={item.title || ''}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            placeholder={`Enter ${fieldName === 'steps' ? 'step' : fieldName === 'values' ? 'value' : 'reason'} title`}
            data-testid={`input-${fieldName}-${index}-title`}
          />
        </div>
        <div>
          <Label className="text-sm">Description</Label>
          <Textarea
            value={item.description || ''}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            placeholder="Enter description..."
            rows={3}
            data-testid={`textarea-${fieldName}-${index}-description`}
          />
        </div>
      </>
    );
  }

  // Commitments (label + value)
  if (fieldName === 'commitments') {
    return (
      <>
        <div>
          <Label className="text-sm">Label</Label>
          <Input
            value={item.label || ''}
            onChange={(e) => updateItem(index, 'label', e.target.value)}
            placeholder="e.g., Client Review Frequency"
            data-testid={`input-${fieldName}-${index}-label`}
          />
        </div>
        <div>
          <Label className="text-sm">Value</Label>
          <Input
            value={item.value || ''}
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            placeholder="e.g., Quarterly"
            data-testid={`input-${fieldName}-${index}-value`}
          />
        </div>
      </>
    );
  }

  // Actions (icon + label + href)
  if (fieldName === 'actions') {
    return (
      <>
        <div>
          <Label className="text-sm">Icon</Label>
          <Select
            value={item.icon || 'ArrowRight'}
            onValueChange={(value) => updateItem(index, 'icon', value)}
          >
            <SelectTrigger data-testid={`select-${fieldName}-${index}-icon`}>
              <SelectValue>
                {item.icon && (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = (LucideIcons as any)[item.icon];
                      return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                    })()}
                    <span>{item.icon}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => {
                const IconComponent = (LucideIcons as any)[option.value];
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Label</Label>
          <Input
            value={item.label || ''}
            onChange={(e) => updateItem(index, 'label', e.target.value)}
            placeholder="e.g., Browse FAQ Database"
            data-testid={`input-${fieldName}-${index}-label`}
          />
        </div>
        <div>
          <Label className="text-sm">Link URL</Label>
          <Input
            value={item.href || ''}
            onChange={(e) => updateItem(index, 'href', e.target.value)}
            placeholder="e.g., /resources?type=faq"
            data-testid={`input-${fieldName}-${index}-href`}
          />
        </div>
      </>
    );
  }

  // Calculator Categories (id, title, icon, description, calculators array)
  if (fieldName === 'categories') {
    const calculators = item.calculators || [];
    return (
      <>
        <div>
          <Label className="text-sm">Category ID</Label>
          <Input
            value={item.id || ''}
            onChange={(e) => updateItem(index, 'id', e.target.value)}
            placeholder="e.g., wealth_management"
            data-testid={`input-${fieldName}-${index}-id`}
          />
        </div>
        <div>
          <Label className="text-sm">Title</Label>
          <Input
            value={item.title || ''}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            placeholder="e.g., Wealth Management"
            data-testid={`input-${fieldName}-${index}-title`}
          />
        </div>
        <div>
          <Label className="text-sm">Icon</Label>
          <Select
            value={item.icon || 'Calculator'}
            onValueChange={(value) => updateItem(index, 'icon', value)}
          >
            <SelectTrigger data-testid={`select-${fieldName}-${index}-icon`}>
              <SelectValue>
                {item.icon && (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = (LucideIcons as any)[item.icon];
                      return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                    })()}
                    <span>{item.icon}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => {
                const IconComponent = (LucideIcons as any)[option.value];
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Description</Label>
          <Textarea
            value={item.description || ''}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            placeholder="Brief description of this calculator category..."
            rows={2}
            data-testid={`textarea-${fieldName}-${index}-description`}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Calculators (2-5 items)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newCalculators = [...calculators, ''];
                updateItem(index, 'calculators', newCalculators);
              }}
              data-testid={`button-add-calculator-${index}`}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          {calculators.map((calc: string, calcIndex: number) => (
            <div key={calcIndex} className="flex gap-2">
              <Input
                value={calc}
                onChange={(e) => {
                  const newCalculators = [...calculators];
                  newCalculators[calcIndex] = e.target.value;
                  updateItem(index, 'calculators', newCalculators);
                }}
                placeholder="e.g., Total Net Worth Calculator"
                data-testid={`input-calculator-${index}-${calcIndex}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newCalculators = calculators.filter((_: any, i: number) => i !== calcIndex);
                  updateItem(index, 'calculators', newCalculators);
                }}
                data-testid={`button-remove-calculator-${index}-${calcIndex}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {calculators.length === 0 && (
            <p className="text-xs text-muted-foreground">Click "Add" to add calculators</p>
          )}
        </div>
      </>
    );
  }

  // Default fallback
  return (
    <div>
      <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>
    </div>
  );
}
