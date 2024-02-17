export default function getColumsCount(width: number) : number {
    if(width > 1800){
        return 5;
    }
    if (width > 1400){
        return 4;
    }   
    if (width > 800){
        return 3;
    }
    if(width > 600)
        return 2;
    return 1;
}