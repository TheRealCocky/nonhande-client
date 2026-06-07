// app/admin/create-user/page.tsx
import InternalRegisterForm from "@/components/auth/InternalRegisterForm";

export default function CreateInternalUserPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <InternalRegisterForm />
        </div>
    );
}