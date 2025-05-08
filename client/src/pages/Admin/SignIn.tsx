import { signInApi } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAdminAuthStore from '@/store/useAdminAuthStore';
import type { SignInFormData } from '@/types/auth';
import { Label } from '@radix-ui/react-label';
import { UserRound, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import toast from 'react-hot-toast';

const SignIn = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formData, setFormData] = useState<SignInFormData>({
        username: '',
        password: '',
        role: "Admin"
    });

    const { isSigningIn, setUserAdmin} = useAdminAuthStore();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) return toast.error("Username is required");
        if (!formData.password.trim()) return toast.error("Password is required");

        return true;
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm() === true) {
            const user = await signInApi(formData);
            setUserAdmin(user)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                    <p className="text-sm text-gray-500">Restricted access. Authorized personnel only.</p>
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
                        disabled={isSigningIn}
                        className="w-full font-semibold transition-colors bg-[#FF9900] text-white hover:bg-[#e68900]"
                    >
                        {isSigningIn ? (
                            <>
                                <Loader2 className="size-5 animate-spin mr-2" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
