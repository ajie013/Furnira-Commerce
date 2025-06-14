import { signUpApi } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import type { SignUpFormData } from '@/types/auth';
import {
    UserRound,
    Mail,
    Phone as PhoneIcon,
    Loader2,
    Lock,
    Loader,
    type LucideIcon,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import {
    useState,
    useEffect,
    type ChangeEvent,
    type FormEvent,
} from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from '@radix-ui/react-label';

/* ---------- field config ---------- */
interface FieldConfig {
    id: keyof SignUpFormData;
    label: string;
    type: string;
    placeholder: string;
    icon: LucideIcon;
}

const FIELDS: FieldConfig[] = [
    { id: 'firstName',   label: 'First Name', type: 'text',     placeholder: 'Juan',          icon: UserRound },
    { id: 'lastName',    label: 'Last Name',  type: 'text',     placeholder: 'Dela Cruz',     icon: UserRound },
    { id: 'username',    label: 'Username',   type: 'text',     placeholder: 'juandelacruz',  icon: UserRound },
    { id: 'email',       label: 'Email',      type: 'email',    placeholder: 'juan@mail.com', icon: Mail },
    { id: 'phoneNumber', label: 'Phone',      type: 'tel',      placeholder: '09171234567',   icon: PhoneIcon },
    { id: 'password',    label: 'Password',   type: 'password', placeholder: '••••••••',      icon: Lock },
];

const SignUp = () => {
    const navigate = useNavigate();
    const { setUserCustomer, isLoading, userCustomer, checkCustomerAuth } =
        userCustomerAuthStore();

    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        phoneNumber: '',
    });

    const signUpMutation = useMutation({
        mutationFn: async () => {
             await signUpApi(formData);
          
        },
        onSuccess: () => {
            toast.success('Sign‑up successful');
            navigate('/');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Sign‑up failed');
        },
    });

    useEffect(() => {
        checkCustomerAuth();
    }, []);

    useEffect(() => {
        if (!isLoading && userCustomer) navigate('/');
    }, [isLoading, userCustomer]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) return toast.error('First name is required');
        if (!formData.lastName.trim()) return toast.error('Last name is required');
        if (!formData.username.trim()) return toast.error('Username is required');
        if (!formData.email.trim()) return toast.error('Email is required');
        if (!/\S+@\S+\.\S+/.test(formData.email))
            return toast.error('Email is invalid');
        if (!formData.phoneNumber.trim()) return toast.error('Phone is required');
        if (!/^\d{7,15}$/.test(formData.phoneNumber))
            return toast.error('Phone is invalid');
        return true;
    };

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        signUpMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader className="animate-spin size-10" />
            </div>
        );
    }

    return (
        <>
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-[#FF9900]">
                        Furnira
                    </Link>
                </div>
            </header>

            <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <form onSubmit={submitForm} className="w-full max-w-md bg-white p-8 rounded-xl shadow space-y-5">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Sign Up</h2>
                    <p className="text-sm text-center text-gray-600 mb-6">
                        Create your account to start shopping
                    </p>

                  
                    <div className="flex gap-4">
                        {FIELDS.slice(0, 2).map((f) => (
                            <div className="w-1/2" key={f.id}>
                                <InputField
                                    {...f}
                                    value={formData[f.id]}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </div>

                 
                    {FIELDS.slice(2).map((f) => (
                        <InputField
                            key={f.id}
                            {...f}
                            value={formData[f.id]}
                            onChange={handleInputChange}
                        />
                    ))}

                    <Button
                        disabled={signUpMutation.isPending}
                        className="w-full font-semibold transition-colors bg-[#FF9900] text-white hover:bg-[#e68900]"
                    >
                        {signUpMutation.isPending ? (
                            <>
                                <Loader2 className="size-5 animate-spin mr-2" />
                                Signing Up...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="text-[#FF9900] font-medium">
                            Sign In
                        </Link>
                    </p>
                </form>
            </main>
        </>
    );
};


interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    icon: LucideIcon;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    label,
    type,
    placeholder,
    icon: Icon,
    value,
    onChange,
}) => (
    <div>
        <Label htmlFor={id} className="text-gray-700 font-medium mb-1 block">
            {label}
        </Label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF9900]" />
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                className="pl-10 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FF9900]"
                onChange={onChange}
                value={value}
            />
        </div>
    </div>
);

export default SignUp;
