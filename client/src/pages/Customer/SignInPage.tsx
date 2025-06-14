import {  signInApi } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import type { SignInFormData } from '@/types/auth';
import { Label } from '@radix-ui/react-label';
import { useMutation } from '@tanstack/react-query';
import { UserRound, Lock, EyeOff, Eye, Loader2, Loader } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formData, setFormData] = useState<SignInFormData>({
        username: '',
        password: '',
        role: 'Customer'
    });
  
    const navigate = useNavigate();

     const signInMutation = useMutation({
        mutationFn: async () => {
           const user = await signInApi(formData);
           setUserCustomer(user);
        },
        onSuccess: () => {
            toast.success('Sign-in successful');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Sign-in failed');
        }
    });

      const { setUserCustomer, isLoading, userCustomer, checkCustomerAuth } = userCustomerAuthStore();

    useEffect(() => {
        checkCustomerAuth();
    }, []);

    useEffect(() => {
        if (!isLoading && userCustomer) {
            navigate('/');
        }
    }, [isLoading, userCustomer]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader className="animate-spin size-10" />
            </div>
        );
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) return toast.error('Username is required');
        if (!formData.password.trim()) return toast.error('Password is required');
        return true;
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
     
        signInMutation.mutate();
    };

    return (
        <>
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-[#FF9900]">
                        Furnira
                    </Link>
                </div>
            </header>

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-md p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                    </div>

                    <form onSubmit={submitForm} className="space-y-5">
                        <div>
                            <Label htmlFor="username" className="text-gray-700 font-medium mb-1 block">
                                Username
                            </Label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF9900]" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    className="pl-10 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FF9900]"
                                    onChange={handleInputChange}
                                    value={formData.username}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-gray-700 font-medium mb-1 block">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF9900]" />
                                <Input
                                    id="password"
                                    type={isShowPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FF9900]"
                                    onChange={handleInputChange}
                                    value={formData.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF9900]"
                                >
                                    {isShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            disabled={signInMutation.isPending}
                            className="w-full font-semibold transition-colors bg-[#FF9900] text-white hover:bg-[#e68900]"
                        >
                            {signInMutation.isPending ? (
                                <>
                                    <Loader2 className="size-5 animate-spin mr-2" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                     <p className="text-sm text-center text-gray-600">
                                            No account?{' '}
                                            <Link to="/sign-up" className="text-[#FF9900] font-medium">
                                                Sign up
                                            </Link>
                                        </p>
                </div>
            </div>
        </>
    );
};

export default SignIn;
