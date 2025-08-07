import {
  Award,
  Castle,
  Check,
  Crown,
  Eye,
  Flag,
  Gem,
  Globe,
  Heart,
  Key,
  Landmark,
  Loader,
  Lock,
  Pencil,
  PencilRuler,
  PenTool,
  PlusCircle,
  Shield,
  Star,
  User,
  UserPlus,
  Zap,
} from "lucide-react";

export const iconOptions = [
  { name: "Crown", icon: Crown },
  { name: "Gem", icon: Gem },
  { name: "User", icon: User },
  { name: "Eye", icon: Eye },
  { name: "Zap", icon: Zap },
  { name: "Landmark", icon: Landmark },
  { name: "PencilRuler", icon: PencilRuler },
  { name: "PenTool", icon: PenTool },
  { name: "Pencil", icon: Pencil },
  { name: "Shield", icon: Shield },
  { name: "Star", icon: Star },
  { name: "Lock", icon: Lock },
  { name: "Key", icon: Key },
  { name: "Globe", icon: Globe },
  { name: "Castle", icon: Castle },
  { name: "Heart", icon: Heart },
  { name: "Flag", icon: Flag },
  { name: "Check", icon: Check },
  { name: "Award", icon: Award },
  { name: "UserPlus", icon: UserPlus },
  { name: "PlusCircle", icon: PlusCircle },
  { name: "Loader", icon: Loader },
];

// Automatyczna mapa ikon do szybkiego lookupu np. po nazwie z bazy danych
export const iconMap = Object.fromEntries(
  iconOptions.map(({ name, icon }) => [name, icon])
);
