import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { SectionSchema } from "@shared/contentSchemas";
import { ArrayFieldEditor } from "./ArrayFieldEditor";
import { RichTextEditor } from "./RichTextEditor";
import * as LucideIcons from "lucide-react";
import { Type, ChevronDown, ChevronUp } from "lucide-react";

const fontFamilyOptions = [
  { label: "Default", value: "" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Sanchez", value: "Sanchez, Georgia, serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

const fontWeightOptions = [
  { label: "Default", value: "" },
  { label: "Light (300)", value: "300" },
  { label: "Normal (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semi-Bold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
];

interface FieldFontStyle {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
}

interface FormRendererProps {
  schema: SectionSchema;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function InlineFontSettings({
  fieldName,
  fontStyle,
  onChange,
}: {
  fieldName: string;
  fontStyle: FieldFontStyle;
  onChange: (style: FieldFontStyle) => void;
}) {
  const [expanded, setExpanded] = useState(
    !!(fontStyle.fontSize || fontStyle.fontFamily || fontStyle.fontWeight)
  );

  return (
    <div className="mt-1 mb-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Type className="h-3 w-3" />
        <span>Font Settings</span>
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {expanded && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Size (px)</Label>
              <Input
                type="number"
                step="0.5"
                min="8"
                max="72"
                placeholder="Default"
                value={fontStyle.fontSize || ""}
                onChange={(e) => onChange({ ...fontStyle, fontSize: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Family</Label>
              <Select
                value={fontStyle.fontFamily || ""}
                onValueChange={(val) => onChange({ ...fontStyle, fontFamily: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value || "__default__"}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Weight</Label>
              <Select
                value={fontStyle.fontWeight || ""}
                onValueChange={(val) => onChange({ ...fontStyle, fontWeight: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {fontWeightOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value || "__default__"}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(fontStyle.fontSize || fontStyle.fontFamily || fontStyle.fontWeight) && (
            <div className="p-2 bg-white rounded border">
              <span
                style={{
                  fontSize: fontStyle.fontSize ? `${fontStyle.fontSize}px` : undefined,
                  fontFamily: fontStyle.fontFamily && fontStyle.fontFamily !== "__default__" ? fontStyle.fontFamily : undefined,
                  fontWeight: fontStyle.fontWeight && fontStyle.fontWeight !== "__default__" ? fontStyle.fontWeight : undefined,
                }}
              >
                Preview: The quick brown fox
              </span>
            </div>
          )}
          {(fontStyle.fontSize || fontStyle.fontFamily || fontStyle.fontWeight) && (
            <button
              type="button"
              onClick={() => onChange({ fontSize: "", fontFamily: "", fontWeight: "" })}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Reset to defaults
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function FormRenderer({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: FormRendererProps) {
  const cleanDefaults = { ...(defaultValues || {}) };
  const initialFontStyles: Record<string, FieldFontStyle> = cleanDefaults._fontStyles || {};
  delete cleanDefaults._fontStyles;

  const form = useForm({
    resolver: zodResolver(schema.schema),
    defaultValues: cleanDefaults,
  });

  const [fontStyles, setFontStyles] = useState<Record<string, FieldFontStyle>>(initialFontStyles);

  const updateFieldFontStyle = (fieldName: string, style: FieldFontStyle) => {
    setFontStyles((prev) => ({ ...prev, [fieldName]: style }));
  };

  const handleSubmit = (data: any) => {
    const cleanedStyles: Record<string, FieldFontStyle> = {};
    for (const [key, style] of Object.entries(fontStyles)) {
      const fs = style.fontSize || "";
      const ff = style.fontFamily === "__default__" ? "" : (style.fontFamily || "");
      const fw = style.fontWeight === "__default__" ? "" : (style.fontWeight || "");
      if (fs || ff || fw) {
        cleanedStyles[key] = {
          ...(fs ? { fontSize: fs } : {}),
          ...(ff ? { fontFamily: ff } : {}),
          ...(fw ? { fontWeight: fw } : {}),
        };
      }
    }
    const hasStyles = Object.keys(cleanedStyles).length > 0;
    onSubmit({ ...data, ...(hasStyles ? { _fontStyles: cleanedStyles } : {}) });
  };

  const isTextField = (control: string) => {
    return control === "text" || control === "textarea" || control === "richtext";
  };

  const renderField = (fieldName: string, meta: any) => {
    const { control, label, placeholder, help, options, min, max, rows } = meta;

    if (control === "text") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  placeholder={placeholder}
                  {...field}
                  data-testid={`input-${fieldName}`}
                />
              </FormControl>
              {help && <FormDescription>{help}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (control === "textarea") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  rows={rows || 4}
                  {...field}
                  data-testid={`textarea-${fieldName}`}
                />
              </FormControl>
              {help && <FormDescription>{help}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (control === "richtext") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder={placeholder}
                />
              </FormControl>
              {help && <FormDescription>{help}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (control === "number") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={placeholder}
                  min={min}
                  max={max}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  data-testid={`input-${fieldName}`}
                />
              </FormControl>
              {help && <FormDescription>{help}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (control === "select") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid={`select-${fieldName}`}>
                    <SelectValue placeholder={placeholder || `Select ${label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((option: any) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      data-testid={`option-${fieldName}-${option.value}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {help && <FormDescription>{help}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (control === "switch") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{label}</FormLabel>
                {help && <FormDescription>{help}</FormDescription>}
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid={`switch-${fieldName}`}
                />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    if (control === "icon") {
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid={`select-${fieldName}`}>
                    <SelectValue placeholder={placeholder || "Select an icon"}>
                      {field.value && (
                        <div className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = (LucideIcons as any)[field.value];
                            return IconComponent ? (
                              <IconComponent className="h-4 w-4" />
                            ) : null;
                          })()}
                          <span>{field.value}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((option: any) => {
                    const IconComponent = (LucideIcons as any)[option.value];
                    return (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        data-testid={`option-${fieldName}-${option.value}`}
                      >
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {help && <FormDescription>{help}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input {...field} data-testid={`input-${fieldName}`} />
            </FormControl>
            {help && <FormDescription>{help}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {Object.entries(schema.uiMeta).map(([fieldName, meta]) => {
          const value = form.watch(fieldName);
          const isArrayField = Array.isArray(value) || 
            fieldName === 'stats' || 
            fieldName === 'features' || 
            fieldName === 'content' || 
            fieldName === 'links' ||
            fieldName === 'categories' ||
            fieldName === 'calculators';

          if (isArrayField) {
            return (
              <ArrayFieldEditor
                key={fieldName}
                form={form}
                fieldName={fieldName}
                label={meta.label}
                help={meta.help}
              />
            );
          }

          return (
            <div key={fieldName}>
              {renderField(fieldName, meta)}
              {isTextField(meta.control) && (
                <InlineFontSettings
                  fieldName={fieldName}
                  fontStyle={fontStyles[fieldName] || {}}
                  onChange={(style) => updateFieldFontStyle(fieldName, style)}
                />
              )}
            </div>
          );
        })}

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-save"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
