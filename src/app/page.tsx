import { redirect } from "next/navigation";
import { MenuConfig } from "@/config/menu";

export default function Home() {
  redirect(MenuConfig[0].key);
}
