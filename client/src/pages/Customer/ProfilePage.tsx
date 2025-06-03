import { getUserByIdApi, updateUserApi } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import userCustomerAuthStore from "@/store/useCustomerAuthStore";
import { Label } from "@radix-ui/react-label";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { userCustomer, checkCustomerAuth } = userCustomerAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userCustomer.userId],
    queryFn: () => getUserByIdApi(userCustomer.userId),
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {

   
      await updateUserApi(userCustomer.userId,formData)
  
      setIsEditing(false);
      toast.success("Profile updated!");
      checkCustomerAuth();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center mt-5">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="shadow border border-gray-300 w-[450px] max-w-[450px] p-6 mt-5">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            {isEditing ? (
              <>
                <Button type="button" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormData({
                      firstName: userData.firstName || "",
                      lastName: userData.lastName || "",
                      email: userData.email || "",
                      phoneNumber: userData.phoneNumber || "",
                    });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
