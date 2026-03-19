"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBatch } from '@/lib/actions/dashboard-actions';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const formSchema = z.object({
  batchName: z.string().min(2, "Batch name is required"),
  breed: z.enum(["Broiler", "Layer"]),
  initialQuantity: z.number().min(1, "Quantity must be at least 1"),
  hatchDate: z.string().min(1, "Hatch date is required"),
  houseId: z.string().min(1, "House selection is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterBatchFormProps {
  houses: Array<{
    id: number;
    name: string;
  }>;
}

export function RegisterBatchForm({ houses }: RegisterBatchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breed: "Broiler",
    },
  });

  const houseOptions = houses.map(h => ({ label: h.name, value: h.id.toString() }));
  const breedOptions = [
    { label: "Broiler (Meat)", value: "Broiler" },
    { label: "Layer (Eggs)", value: "Layer" }
  ];

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createBatch({
        houseId: parseInt(data.houseId),
        breedType: data.breed,
        initialCount: data.initialQuantity,
        arrivalDate: data.hatchDate,
      });

      if (result.success) {
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Batch Name"
          placeholder="e.g., Spring-Broiler-01"
          {...register("batchName")}
          error={errors.batchName?.message}
        />

        <Select
          label="Breed"
          options={breedOptions}
          {...register("breed")}
          error={errors.breed?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Initial Quantity"
            type="number"
            placeholder="1000"
            {...register("initialQuantity", { valueAsNumber: true })}
            error={errors.initialQuantity?.message}
          />

          <Select
            label="House"
            options={[{ label: "Select House", value: "" }, ...houseOptions]}
            {...register("houseId")}
            error={errors.houseId?.message}
          />
        </div>

        <Input
          label="Hatch Date"
          type="date"
          {...register("hatchDate")}
          error={errors.hatchDate?.message}
        />

        <div className="pt-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            Register Batch
          </Button>
        </div>
      </form>
    </div>
  );
}
