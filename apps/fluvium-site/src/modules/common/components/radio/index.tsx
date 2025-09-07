const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
        checked ? 'border-cyan-400 bg-cyan-400' : 'border-gray-500'
      }`}
      data-testid={dataTestId || 'radio-button'}
      role="radio"
      aria-checked={checked}
    >
      {checked && (
        <div className="w-2 h-2 rounded-full bg-white"></div>
      )}
    </div>
  )
}

export default Radio
