export const data_seter = () =>{
    for (const [key, value] of Object.entries(newInfo)) {
        if (this.gridForm.hasOwnProperty(key)) {
          if (typeof value === 'object') {
            if (value.hasOwnProperty('id')) {
             return this.gridForm[key] = value.id
            }else {
             return this.gridForm[key] = value[0]
            }
          }else{
            return this.gridForm[key] = value
          }
        }
      }
}