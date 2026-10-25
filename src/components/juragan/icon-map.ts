/**
 * ICON MAP — resolusi ikon lucide-react berdasarkan nama (dari database).
 * Hanya ikon yang dipakai CMS yang didaftarkan — ringan & aman tree-shaking.
 */
import {
  BadgeCheck,
  BadgePercent,
  Building2,
  ClipboardCheck,
  Droplets,
  Factory,
  FileCheck2,
  FlaskConical,
  Gem,
  Handshake,
  HardHat,
  Headset,
  Home,
  Landmark,
  MessagesSquare,
  Package,
  Scale,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export const CMS_ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  BadgePercent,
  Building2,
  ClipboardCheck,
  Droplets,
  Factory,
  FileCheck2,
  FlaskConical,
  Gem,
  Handshake,
  HardHat,
  Headset,
  Home,
  Landmark,
  MessagesSquare,
  Package,
  Scale,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Warehouse,
};

export const CMS_ICON_NAMES = Object.keys(CMS_ICONS);

export function getIcon(name: string): LucideIcon {
  return CMS_ICONS[name] ?? Gem;
}
