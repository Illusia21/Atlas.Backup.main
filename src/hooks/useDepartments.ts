import { useQuery } from '@tanstack/react-query'
import { departmentApi } from '../lib/api'

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.getAll(),
  })
}

