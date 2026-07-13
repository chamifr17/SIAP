import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import { isQRTokenValid, readQRToken, secondsRemaining } from '../../lib/qrToken';

const schema = z.object({
  bodyNumber: z.string().min(2, 'No. badan is required'),
  rank: z.string().min(2, 'Pangkat is required'),
  name: z.string().min(2, 'Name is required'),
  vehicle: z.string().min(2, 'Vehicle details are required'),
  destination: z.string().min(2, 'Destination is required'),
  purpose: z.string().min(2, 'Purpose is required'),
  expectedReturn: z.string().min(4, 'Expected return time is required'),
  phone: z.string().min(6, 'Phone number is required'),
  remarks: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export function OutsideCheckInForm() {
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const qrState = readQRToken(location.search);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!isQRTokenValid(qrState)) {
    return <section className="card space-y-3 text-center"><h2 className="text-xl font-bold">QR Expired</h2><p className="text-sm text-slate-500">Please scan the latest QR shown by the Duty Officer.</p></section>;
  }

  if (submitted) {
    return <section className="card space-y-2 text-center"><h2 className="text-xl font-bold">Outside Movement Checked In</h2><p className="text-sm text-slate-500">Duty Officer has received your outside movement record.</p></section>;
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(() => setSubmitted(true))}>
      <section className="card space-y-2"><h2 className="text-xl font-bold">Go Outside Form</h2><p className="text-sm text-slate-500">Fill in your personal and movement details before leaving.</p><p className="text-xs font-semibold text-olive-700 dark:text-olive-100">QR valid for {secondsRemaining(qrState!.expiresAt)} seconds</p></section>
      <label className="block space-y-2"><span className="label">No. Badan</span><input className="field" {...register('bodyNumber')} />{errors.bodyNumber && <p className="text-sm text-red-600">{errors.bodyNumber.message}</p>}</label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2"><span className="label">Pangkat</span><input className="field" {...register('rank')} />{errors.rank && <p className="text-sm text-red-600">{errors.rank.message}</p>}</label>
        <label className="block space-y-2"><span className="label">Phone</span><input className="field" inputMode="tel" {...register('phone')} />{errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}</label>
      </div>
      <label className="block space-y-2"><span className="label">Nama</span><input className="field" {...register('name')} />{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Kenderaan</span><input className="field" placeholder="Car / Motorcycle / Walking" {...register('vehicle')} />{errors.vehicle && <p className="text-sm text-red-600">{errors.vehicle.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Destination</span><input className="field" {...register('destination')} />{errors.destination && <p className="text-sm text-red-600">{errors.destination.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Purpose</span><input className="field" {...register('purpose')} />{errors.purpose && <p className="text-sm text-red-600">{errors.purpose.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Expected Return</span><input className="field" type="time" {...register('expectedReturn')} />{errors.expectedReturn && <p className="text-sm text-red-600">{errors.expectedReturn.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Remarks</span><textarea className="field min-h-24" {...register('remarks')} /></label>
      <button className="btn-primary w-full">Check In Outside Movement</button>
    </form>
  );
}
