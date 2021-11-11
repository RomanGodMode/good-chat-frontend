import { toast } from 'react-toastify'
import { AxiosError } from 'axios'


const handle = (error: AxiosError, possibleFieldErrors: string[]) => {
  const detail = error.response?.data?.detail
  if (detail) {
    return toast.error(detail)
  }

  const errors: string[] = possibleFieldErrors.map(field => error.response?.data?.[field]?.[0])
  errors.filter(Boolean).forEach(message => toast.error(message))
}

export const handleServerError = (possibleFieldErrors: string[] = []) => (error: AxiosError) =>
  handle(error, possibleFieldErrors)
