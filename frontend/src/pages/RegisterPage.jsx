import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthLoading, authError, setAuthError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await register(formData.email, formData.password, formData.name);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthLayout
      title="Register"
      description="Enter your name, email and password to register"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    >
      <form onSubmit={handleSubmit}>
        <Input
          className="mb-4 py-6 md:text-base text-sm"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setAuthError(null);
          }}
          placeholder="Name"
        />
        <Input
          className="mb-4 py-6 md:text-base text-sm"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            setAuthError(null);
          }}
          placeholder="Email"
        />
        <div className="relative">
          <Input
            className="mb-4 py-6 md:text-base text-sm"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setAuthError(null);
            }}
            placeholder="Password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {authError && <p className="text-red-500 py-2">{authError}</p>}

        <Button
          type="submit"
          className="py-6 text-sm w-full hover:scale-105 transition-transform cursor-pointer"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
