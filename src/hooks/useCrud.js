import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export function useCrud(table, selectQuery = '*', orderBy = 'created_at', ascending = false) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data: rows, error } = await supabase
      .from(table)
      .select(selectQuery)
      .order(orderBy, { ascending })

    if (error) {
      toast.error(`Erro ao buscar ${table}`)
      console.error(error)
    } else {
      setData(rows || [])
    }
    setLoading(false)
  }, [table, selectQuery, orderBy, ascending])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const insertRow = async (payload, successMessage = 'Registro adicionado com sucesso!') => {
    const { error } = await supabase.from(table).insert(payload)
    if (error) {
      toast.error('Não foi possível salvar.')
      throw error
    }
    toast.success(successMessage)
    await fetchAll()
  }

  const updateRow = async (id, payload, successMessage = 'Registro atualizado com sucesso!') => {
    const { error } = await supabase.from(table).update(payload).eq('id', id)
    if (error) {
      toast.error('Não foi possível atualizar.')
      throw error
    }
    toast.success(successMessage)
    await fetchAll()
  }

  const deleteRow = async (id, successMessage = 'Registro removido com sucesso!') => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      toast.error('Não foi possível remover.')
      throw error
    }
    toast.success(successMessage)
    await fetchAll()
  }

  return {
    data,
    loading,
    fetchAll,
    insertRow,
    updateRow,
    deleteRow,
  }
}
