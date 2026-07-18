"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { BODY_PARTS, BODY_PART_LABEL_KEYS, type BodyPart } from "@/types/domain"

export function BodyPartFilter({
  value,
  onChange,
}: {
  value: BodyPart | "all"
  onChange: (value: BodyPart | "all") => void
}) {
  const t = useTranslations("exercises")

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      <Button
        type="button"
        size="sm"
        variant={value === "all" ? "default" : "outline"}
        className="shrink-0 rounded-full"
        onClick={() => onChange("all")}
      >
        {t("allBodyParts")}
      </Button>
      {BODY_PARTS.map((bp) => (
        <Button
          key={bp}
          type="button"
          size="sm"
          variant={value === bp ? "default" : "outline"}
          className="shrink-0 rounded-full"
          onClick={() => onChange(bp)}
        >
          {t(`bodyParts.${BODY_PART_LABEL_KEYS[bp]}`)}
        </Button>
      ))}
    </div>
  )
}
