import PatientCard from "@/components/PatientCard";
export default function PatientsPage() {
const patients = [
{nom:"Ndéye Félicité Diop",fonction:"gardien",groupe:8,sexe:"F" as const},
{nom:"Mouhammed Guèye",fonction:"bouclier",groupe:8,sexe:"M" as const},
{nom:"Mouhammed Ba",fonction:"architect",groupe:8,sexe:"F" as const},
{nom:"Fatou Kiné Dianko",fonction:"pilote",groupe:8,sexe:"M" as const},
];
return (
<div>
<h1 className="text-2xl font-bold text-gray-800 mb-6">Patients</h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{patients.map((p,i)=>(<PatientCard key={i} {...p}/>))}
</div>
</div>
);
}
