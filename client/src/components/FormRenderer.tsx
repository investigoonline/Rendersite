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

interface FormRendererProps {
  schema: SectionSchema;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function FormRenderer({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: FormRendererProps) {
  const form = useForm({
    resolver: zodResolver(schema.schema),
    defaultValues: defaultValues || {},
  });

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

    // Handle icon picker (uses select with icon preview)
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

    // Default fallback to text input
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {Object.entries(schema.uiMeta).map(([fieldName, meta]) => {
          // Check if this is an array field by looking at the fieldName
          // Array fields like "stats", "features", "content", "links", "categories" need special handling
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

          return <div key={fieldName}>{renderField(fieldName, meta)}</div>;
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
