"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TIPO_ANEXO } from "@/lib/labels"

export function AnexoUpload({ idTrabalho }: { idTrabalho: number }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [tipo, setTipo] = useState<"foto_antes" | "foto_depois" | "documento">("foto_antes")
  const [aEnviar, setAEnviar] = useState(false)

  async function enviarFicheiro(file: File) {
    setAEnviar(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const caminho = `${idTrabalho}/${crypto.randomUUID()}-${file.name}`

    const { error: erroUpload } = await supabase.storage.from("anexos").upload(caminho, file)
    if (erroUpload) {
      toast.error("Não foi possível carregar o ficheiro.")
      setAEnviar(false)
      return
    }

    const { error: erroInsert } = await supabase.from("anexos").insert({
      id_trabalho: idTrabalho,
      id_utilizador: user?.id ?? null,
      tipo,
      url_ficheiro: caminho,
    })

    if (erroInsert) {
      toast.error("Ficheiro carregado, mas não foi possível registá-lo.")
      setAEnviar(false)
      return
    }

    toast.success("Anexo adicionado.")
    setAEnviar(false)
    if (inputRef.current) inputRef.current.value = ""
    router.refresh()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue>
            {(value: string | null) => (value ? TIPO_ANEXO[value as keyof typeof TIPO_ANEXO].label : "")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(["foto_antes", "foto_depois", "documento"] as const).map((t) => (
            <SelectItem key={t} value={t}>
              {TIPO_ANEXO[t].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) enviarFicheiro(file)
        }}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={aEnviar}
        onClick={() => inputRef.current?.click()}
      >
        {aEnviar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Carregar ficheiro
      </Button>
    </div>
  )
}
