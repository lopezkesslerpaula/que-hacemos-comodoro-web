
"use client";

type Props = {
  eventId: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

export default function ConfirmarEliminar({
  eventId,
  deleteAction,
}: Props) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        const confirmado = window.confirm(
          "¿Estás segura de que querés eliminar este evento definitivamente?"
        );

        if (!confirmado) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="eventId" value={eventId} />

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
  );
}
