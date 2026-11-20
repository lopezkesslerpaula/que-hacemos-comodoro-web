
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

import ConfirmarEliminar from "./ConfirmarEliminar";

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
    .select("*");


   

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
                  background: 'white',
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #ddd',
                  display: 'grid',
                  gap: 10,
                }}
              >
                {event.cover_image_url && (
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    style={{
                      width: '100%',
                      maxHeight: 260,
                      objectFit: 'contain',
                      borderRadius: 10,
                      background: '#f5f5f5',
                    }}
                  />
                )}

                <h3 style={{ margin: 0 }}>{event.title}</h3>

                <p><strong>Categoría:</strong> {event.category || 'Sin categoría'}</p>
                <p><strong>Fecha:</strong> {event.event_date ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-AR') : 'Sin fecha'}</p>
                <p><strong>Horario:</strong> {event.event_time || 'Sin horario'}</p>
                <p><strong>Lugar:</strong> {event.place || 'Sin lugar'}</p>
                <p><strong>Dirección:</strong> {event.address || 'Sin dirección'}</p>
                <p><strong>Entrada:</strong> {event.entry_type || 'No especificada'}</p>
                <p><strong>Precio:</strong> {event.price || 'No especificado'}</p>
                <p><strong>Estado:</strong> {event.status}</p>

                <ConfirmarEliminar
                  eventId={String(event.id)}
                  deleteAction={deleteEvent}
                />
              </div>



          
          ))}
        </div>
      )}
    </main>
  );
}
