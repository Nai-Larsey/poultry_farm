'use client';

import React, { useState } from 'react';
import { onboardFarmer } from '@/lib/actions/dashboard-actions';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Layout, MapPin, BarChart3, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const capacity = parseInt(formData.get('capacity') as string);

    try {
      const result = await onboardFarmer({ name, location, capacity });
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Failed to onboard. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-green-900">Welcome to Poultry PMS</h1>
          <p className="mt-2 text-sm text-gray-600">
            Let's get your farm set up to start tracking your operations.
          </p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Farm Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input 
                  label="Farm Name"
                  name="name"
                  required
                  placeholder="e.g. Green Valley Farm"
                />
                <Input 
                  label="Location"
                  name="location"
                  required
                  placeholder="e.g. Kumasi, Ghana"
                />
                <Input 
                  label="Total Capacity (Birds)"
                  name="capacity"
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 5000"
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-6 rounded-2xl text-lg flex items-center justify-center gap-2"
              >
                <span>Start Managing Farm</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
