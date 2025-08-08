"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "ชื่อบัญชีต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  }),
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
    },
  });

  // Define a submit handler.
  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  function handleDelete() {
    onDelete?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อบัญชี</FormLabel>
              <FormControl>
                <Input
                  placeholder="เช่น เงินสด, บัญชีธนาคาร, พร้อมเพย์ ฯลฯ"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="flex items-center w-full" disabled={disabled}>
          <Edit2 />

          {id ? <p>บันทึก</p> : <p>สร้างบัญชีใหม่</p>}
        </Button>

        {!!id && (
          <Button
            onClick={handleDelete}
            variant="destructive"
            type="button"
            className="flex items-center w-full"
            disabled={disabled}
          >
            <Trash2 />
            <p>ล้างบัญชี</p>
          </Button>
        )}
      </form>
    </Form>
  );
};
export default AccountForm;
