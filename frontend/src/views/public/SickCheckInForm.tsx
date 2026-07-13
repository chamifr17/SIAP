import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../../lib/api';
import { isQRTokenValid, readQRToken, secondsRemaining } from '../../lib/qrToken';

const schema = z.object({
  bodyNumber: z.string().min(2, 'No. badan is required'),
  rank: z.string().min(2, 'Pangkat is required'),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  symptoms: z.string().min(1, 'Select symptoms'),
  description: z.string().min(5, 'Describe your condition'),
  locationType: z.enum(['Duty Officer Room', 'Own Room']),
  building: z.string().optional(),
  room: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.locationType === 'Own Room' && (!data.building || !data.room)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['room'], message: 'Building and room are required' });
  }
});

type FormData = z.infer<typeof schema>;

export function SickCheckInForm() {
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const qrState = readQRToken(location.search);
  const submitReport = useMutation({ mutationFn: api.createPublicSickReport, onSuccess: () => setSubmitted(true) });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { locationType: 'Duty Officer Room' }
  });
  const ownRoom = watch('locationType') === 'Own Room';

  if (!isQRTokenValid(qrState)) {
    return <section className="card space-y-3 text-center"><h2 className="text-xl font-bold">QR Expired</h2><p className="text-sm text-slate-500">Please scan the latest QR shown by the Duty Officer.</p></section>;
  }

  if (submitted) {
    return <section className="card space-y-2 text-center"><h2 className="text-xl font-bold">Sick Report Checked In</h2><p className="text-sm text-slate-500">Duty Officer has received your sick report.</p></section>;
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit((data) => submitReport.mutate({ ...data, qrToken: qrState?.token }))}>
      <section className="card space-y-2"><h2 className="text-xl font-bold">Lapor DO Sakit</h2><p className="text-sm text-slate-500">Fill in your personal and sick report details.</p><p className="text-xs font-semibold text-olive-700 dark:text-olive-100">QR valid for {secondsRemaining(qrState!.expiresAt)} seconds</p></section>
      <label className="block space-y-2"><span className="label">No. Badan</span><input className="field" {...register('bodyNumber')} />{errors.bodyNumber && <p className="text-sm text-red-600">{errors.bodyNumber.message}</p>}</label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2"><span className="label">Pangkat</span><input className="field" {...register('rank')} />{errors.rank && <p className="text-sm text-red-600">{errors.rank.message}</p>}</label>
        <label className="block space-y-2"><span className="label">Phone</span><input className="field" inputMode="tel" {...register('phone')} />{errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}</label>
      </div>
      <label className="block space-y-2"><span className="label">Nama</span><input className="field" {...register('name')} />{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Symptoms</span><select className="field" {...register('symptoms')}><option value="">Select</option><option>Fever</option><option>Headache</option><option>Stomach Pain</option><option>Injury</option><option>Others</option></select>{errors.symptoms && <p className="text-sm text-red-600">{errors.symptoms.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Description</span><textarea className="field min-h-24" {...register('description')} />{errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}</label>
      <label className="block space-y-2"><span className="label">Rest Location</span><select className="field" {...register('locationType')}><option>Duty Officer Room</option><option>Own Room</option></select></label>
      {ownRoom && <div className="grid grid-cols-2 gap-3"><label className="block space-y-2"><span className="label">Building</span><input className="field" {...register('building')} /></label><label className="block space-y-2"><span className="label">Room</span><input className="field" {...register('room')} /></label></div>}
      {errors.room && <p className="text-sm text-red-600">{errors.room.message}</p>}
      {submitReport.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to submit. Make sure the backend server is running on the DO laptop.</p>}
      <button className="btn-danger w-full" disabled={submitReport.isPending}>{submitReport.isPending ? 'Submitting...' : 'Check In Sick Report'}</button>
    </form>
  );
}
