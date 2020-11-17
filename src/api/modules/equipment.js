import service from '@/api/service'

export default {
  getEquipmentLists (params) {
    return service.get('/device', params)
  },
  deleteEquipment (id) {
    return service.delete(`/device/${id}`)
  },
  updateEquipment (params) {
    return service.post('/device', params)
  }
}
