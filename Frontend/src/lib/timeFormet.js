const timeFormat =(minutes)=>{

const hours= Math.floor(minutes/60);
const minutesRemaindar= minutes %60;
return `${hours}h ${minutesRemaindar}m`


}

export default timeFormat;