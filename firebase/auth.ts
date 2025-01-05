import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '.';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          localStorage.setItem('userDeskData', JSON.stringify(user));
        } else {
          setUser(null);
          localStorage.removeItem('userDeskData');
          router.push('/login');
        }
      });

      return () => unsubscribe();
   
  }, [router]);

  return user;
};