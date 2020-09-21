
export const typeBy = (state) => (id) => {
    let type = state.types.find(type => type.id == id);
    
      if(type) {              
        return type.name;
    }
}

export const busBy = (state) => (id) => {
    return state.availableBusList.find(element => element.bus.id == id
    );            
}

export const getIndexOf = (state) => (bus) => {
    return state.availableBusList.indexOf(bus);
}

export const isRegNumberAvailable = (state) => (number) => {
	return state.availableBusList.some(bus => 
		bus.bus.reg_no === number
	); 
}