/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/use-toast';
import { ProjectDetails } from '../../../types';

export default function WaybackurlsArchiveJob() {
  const { projectSlug } = useParams();
  const [projectDetails, setDetails] = useState<ProjectDetails>();
  useEffect(() => {
    const details: ProjectDetails = window.electron.ipcRenderer.sendSync(
      'get-project-details',
      projectSlug,
    );
    setDetails(details);
  }, []);

  const [Loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const RunWaybackurlsArchive = () => {
    setLoading(true);
    if (projectDetails) {
      const res = window.electron.ipcRenderer.sendSync('waybackurls-archive', {
        projectName: projectDetails.name,
        domain: projectDetails.domain,
      });
      if (res) {
        toast({
          title: 'Archive is ready',
        });
      }
    }
    setLoading(false);
  };
  return (
    <>
      {!Loading ? (
        <Button onClick={RunWaybackurlsArchive}>Process</Button>
      ) : (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )}
    </>
  );
}
