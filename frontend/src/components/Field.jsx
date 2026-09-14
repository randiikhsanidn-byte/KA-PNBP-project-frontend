export function Field({ label, hint, error, required = false, children, htmlFor }) {
  return (
    <div className="block">
      {label ? (
        <label htmlFor={htmlFor} className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800">
          <span>
            {label}
            {required ? <span className="ml-1 text-red-500" aria-hidden="true">*</span> : null}
          </span>
        </label>
      ) : null}
      {children}
      {hint && !error ? <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span> : null}
      {error ? <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span> : null}
    </div>
  )
}

export const inputClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-4 focus:ring-navy-700/10 disabled:bg-slate-100 disabled:cursor-not-allowed'

export const selectClass =
  'h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-700/10 disabled:bg-slate-100 disabled:cursor-not-allowed'

export const textareaClass =
  'min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-700 focus:ring-4 focus:ring-navy-700/10 disabled:bg-slate-100 disabled:cursor-not-allowed'
