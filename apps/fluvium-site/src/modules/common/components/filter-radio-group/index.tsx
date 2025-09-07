import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Text className="text-sm font-medium text-white">{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
        {items?.map((i) => (
          <div
            key={i.value}
            className="flex items-center gap-x-3"
          >
            <RadioGroup.Item
              checked={i.value === value}
              className="w-4 h-4 border border-gray-400 rounded-full peer sr-only"
              id={i.value}
              value={i.value}
            />
            <div className={clx(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer",
              {
                "border-cyan-400 bg-cyan-400": i.value === value,
                "border-gray-400": i.value !== value,
              }
            )}>
              {i.value === value && (
                <div className="w-2 h-2 rounded-full bg-black"></div>
              )}
            </div>
            <Label
              htmlFor={i.value}
              className={clx(
                "text-sm cursor-pointer",
                {
                  "text-white font-medium": i.value === value,
                  "text-gray-300": i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
