// app/admin/create-user/page.tsx
import InternalRegisterForm from "@/components/auth/InternalRegisterForm";
import { BackButton } from "@/components/shared/BackButton";

export default function CreateInternalUserPage() {
    return (
        
        <div className="min-h-screen bg-background flex  flex-col items-center justify-center p-4">
            <div className="flex justify-start">
                    <BackButton destiny="/" />
                  </div>
            <InternalRegisterForm />
        </div>
    );
}