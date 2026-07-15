"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { profileService } from "@/services/api";
import {
  User,
  Mail,
  Shield,
  Save,
  Loader2,
  Zap,
  Heart,
  Flame,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { UpdateProfileData } from "@/types/profile";
import { BackButton } from "@/components/shared/BackButton";
import AuthWallModal from "@/components/modals/AuthWallModal";
export default function ProfilePage() {
  const { profile, loading, refresh } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await profileService.updateMe(formData);
      await refresh();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao lapidar o perfil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-gold">
        Sincronizando rastro ancestral...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <AuthWallModal></AuthWallModal>
      <div className="flex justify-start">
        <BackButton destiny="/" />
      </div>

      {/* HEADER / AVATAR + BIO NO CARD */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-card border border-border p-10 rounded-[48px] shadow-sm relative overflow-hidden">
        <div className="w-32 h-32 rounded-[40px] bg-gold/10 border-4 border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} className="text-gold opacity-50" />
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              {profile?.name}
            </h1>

            <p className="text-sm font-medium text-muted-foreground italic max-w-md">
              {profile?.bio ||
                "Sem rastro de bio... Escreve a tua história abaixo."}
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Badge
              icon={<Zap size={12} />}
              label={`${profile?.xp} XP`}
              color="bg-gold/20 text-gold"
            />
            <Badge
              icon={<Heart size={12} />}
              label={`${profile?.hearts} Vidas`}
              color="bg-red-500/10 text-red-500"
            />
            <Badge
              icon={<Flame size={12} />}
              label={`${profile?.streak} Dias`}
              color="bg-orange-500/10 text-orange-500"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 px-2">
            Identidade
          </h3>
          <div className="bg-secondary/30 p-6 rounded-[32px] space-y-4 border border-border/50">
            <InfoItem
              icon={<Mail size={16} />}
              label="Email"
              value={profile?.email || ""}
            />
            <InfoItem
              icon={<Shield size={16} />}
              label="Nível de Acesso"
              value={profile?.role || "STUDENT"}
            />
            <div className="pt-4 border-t border-border/50">
              <p className="text-[10px] font-bold opacity-40 uppercase">
                Na Nonhande desde
              </p>
              <p className="text-xs font-bold">
                {profile
                  ? new Date(profile.createdAt).toLocaleDateString("pt-AO")
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleUpdate}
          className="md:col-span-2 space-y-6 bg-card border border-border p-8 rounded-[40px]"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest px-1">
                Nome de Guerra
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-secondary/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-gold outline-none font-bold transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest px-1">
                Tua História (Bio)
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Como queres ser lembrado no ranking de Angola?"
                className="w-full bg-secondary/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-gold outline-none font-medium resize-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || showSuccess}
            className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              showSuccess
                ? "bg-green-600 text-white"
                : "bg-gold hover:bg-gold/90 text-white"
            }`}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )}
            {isSaving
              ? "A LAPIDAR..."
              : showSuccess
                ? "PERFIL ATUALIZADO!"
                : "GUARDAR ALTERAÇÕES"}
          </button>
        </form>
      </div>

      {profile?.role === "ADMIN" && (
        <Link
          href="/auth/sginup-teacher-admin"
          className="w-full mt-4 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all"
        >
          <Shield size={14} />
          Criar Contas
        </Link>
      )}
    </div>
  );
}

function Badge({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <span
      className={`${color} px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter`}
    >
      {icon} {label}
    </span>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gold">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold opacity-40 uppercase leading-none">
          {label}
        </p>
        <p className="text-xs font-bold truncate">{value}</p>
      </div>
    </div>
  );
}
