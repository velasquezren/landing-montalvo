import { CRM_API_URL } from "@/lib/crm/config";
import { consultarAgendaCRM } from "@/lib/agenda/proxy";

export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ recurso: string }> }) {
  const { recurso } = await params;
  return consultarAgendaCRM(recurso, new URL(request.url).searchParams, {
    habilitada: process.env.AGENDA_VPS_LECTURA === "on", crmUrl: CRM_API_URL,
  });
}
