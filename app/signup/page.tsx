'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        // Validation
        const newErrors: any = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.name);

        if (error) {
            toast.error(error.message || 'Failed to create account');
            setLoading(false);
        } else {
            setShowEmailVerification(true);
            setLoading(false);
            toast.success('Verification email sent! Check your inbox.');
        }
    };

    if (showEmailVerification) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card variant="light" className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-text mb-2">Check Your Email</h2>
                        <p className="text-text-muted mb-6">
                            We've sent a verification link to <strong className="text-text">{formData.email}</strong>
                        </p>

                        <div className="bg-surface/50 rounded-lg p-4 mb-6 text-left space-y-2">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-text-muted">
                                    Click the link in the email to verify your account
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-text-muted">
                                    After verification, you can sign in
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-text-dim mb-4">
                            Didn't receive the email? Check your spam folder.
                        </p>

                        <Link href="/login">
                            <Button variant="primary" size="lg" className="w-full">
                                Go to Sign In
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gradient mb-3">
                        SettleUp
                    </h1>
                    <p className="text-text-muted text-lg">
                        Create your account to get started.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            error={errors.name}
                            autoComplete="name"
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            error={errors.email}
                            autoComplete="email"
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            error={errors.password}
                            autoComplete="new-password"
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            error={errors.confirmPassword}
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-muted">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-primary hover:text-primary-light font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
