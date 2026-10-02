"use client";

import { useLinkStatus } from "next/link";

/** Solo aparece si la ruta no estaba precargada; nunca desplaza el enlace. */
export default function NavigationHint() {
  const { pending } = useLinkStatus();
  return <span aria-hidden="true" className="navigation-hint" data-pending={pending || undefined} />;
}
