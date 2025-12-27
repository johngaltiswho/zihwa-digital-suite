export default function MapPlaceholder() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-10">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.958L9 2m0 18l6-3m-6 3V2m6 15l5.447-2.724A2 2 0 0021 12.382V3.618a2 2 0 00-1.553-1.958L15 2m0 15V2"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Live Projects Map
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          Interactive project locations will be available here shortly.
          <br />
          This feature is currently under integration.
        </p>

        {/* Divider */}
        <div className="mt-6 h-px w-24 mx-auto bg-gray-300" />
      </div>
    </div>
  );
}
