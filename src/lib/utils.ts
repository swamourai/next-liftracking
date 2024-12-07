export function dayByDate(datetime:Date) {
    const date = new Date(datetime);
    const yyyy = date.getFullYear();
    let mm: number | string = date.getMonth() + 1; // Months start at 0!
    let dd: number | string = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '/' + mm + '/' + yyyy;
}

export function sum(a: number, b: number): number {
    return a + b;
  }