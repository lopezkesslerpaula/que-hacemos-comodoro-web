
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

function getAdminToken() {
  const password = process.env.ADMIN_ACCESS_PASSWORD;
  if (!password) {
    throw new Error("Falta configurar la contraseña de administración.");
  }
  return createHash("sha256").update(password).digest("hex");
}

async function deleteEvent(formData: FormData) {
  "use server";

  const eventId = String(formData.get("eventId") ?? "");
  const cookieStore = await cookies();
  const authenticated =
    cookieStore.get("qhc_admin_session")?.value === getAdminToken();

  if (!authenticated || !eventId) {
    redirect("/admin");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    throw new Error("No se pudo eliminar el evento: " + error.message);
  }

  redirect("/admin/eventos");
}

export default async function AdministrarEventos() {
  const cookieStore = await cookies();
  const authenticated =
    cookieStore.get("qhc_admin_session")?.value === getAdminToken();

  if (!authenticated) {
    redirect("/admin");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, status, starts_at")
    .order("starts_at", { ascending: false });

  if (error) {
    throw new Error("No se pudieron cargar los eventos: " + error.message);
  }

  return (
    <main style={{ maxWidth: 850, margin: "40px auto", padding: 20 }}>
      <Link href="/admin">← Volver al panel</Link>

      <h1 style={{ marginTop: 25 }}>Administrar eventos</h1>

      <p>Desde aquí podés eliminar eventos de prueba o repetidos.</p>

      {!events?.length ? (
        <p>No hay eventos registrados.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 25 }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "white",
                padding: 18,
                borderRadius: 12,
                border: "1px solid #ddd6fe",
              }}
            >
              <h3>{event.title}</h3>
              <p>Fecha: {event.starts_at ? new Date(event.starts_at).toLocaleString("es-AR") : "Sin fecha"}</p>
              <p>Estado: {event.status}</p>

              

<form action={deleteEvent}>


                <input type="hidden" name="eventId" value={event.id} />
                <button
                  type="submit"
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Eliminar evento
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
