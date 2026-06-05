import { useCallback, useRef, useState } from 'react'
import { Icon } from '../icons'
import Button from './Button'
import { ConfirmContext } from './confirmContext'

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback((options) => {
    setState({
      title: 'Confirmer l’action',
      message: 'Cette action est irréversible.',
      confirmLabel: 'Confirmer',
      cancelLabel: 'Annuler',
      tone: 'danger',
      ...options,
    })
    return new Promise((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = (result) => {
    resolver.current?.(result)
    resolver.current = null
    setState(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
          onClick={() => close(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lift w-full max-w-sm p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto">
              <Icon name="alert" className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-center font-display text-lg font-semibold text-ink-900">
              {state.title}
            </h2>
            <p className="mt-1.5 text-center text-sm text-ink-500">{state.message}</p>
            <div className="mt-6 flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={() => close(false)}>
                {state.cancelLabel}
              </Button>
              <Button
                variant={state.tone === 'danger' ? 'danger' : 'primary'}
                className="flex-1"
                onClick={() => close(true)}
              >
                {state.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
