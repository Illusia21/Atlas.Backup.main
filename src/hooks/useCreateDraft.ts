import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reimbursementApi, type ReimbursementRequest } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export function useCreateDraft() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<ReimbursementRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) =>
      reimbursementApi.createDraft(data),
    onSuccess: (data) => {
      console.log('[FRONTEND] Draft created successfully:', data.id)
      // Cache the draft
      queryClient.setQueryData(['reimbursement', 'draft', data.id], data)
      // Navigate to Step 2 (mock mode - Step 2 will show placeholder)
      console.log('[FRONTEND] Navigating to Step 2 with draft ID:', data.id)
      navigate(`/reimbursement/step2/${data.id}`)
    },
    onError: (error) => {
      console.error('[FRONTEND] Failed to create draft:', error)
      // In mock mode, this shouldn't happen, but show user-friendly message
      alert('Failed to create draft. Please try again.')
    },
  })
}

