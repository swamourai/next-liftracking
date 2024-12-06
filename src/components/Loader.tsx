import { LoaderCircle } from 'lucide-react';

function Loader() {
    return (
        <p className="p-10">
            <LoaderCircle className="animate-spin m-auto" />
        </p>
    );
}

export default Loader;