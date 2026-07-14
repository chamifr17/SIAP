import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../../lib/api';
import { isQRTokenValid, readQRToken, secondsRemaining } from '../../lib/qrToken';
import { DutyOfficerNotice } from './DutyOfficerNotice';
import { FieldShell, FormHero, FormSection } from './FormParts';

const schema = z.object({
  bodyNumber: z.string().min(2, 'No. badan is required'),
  rank: z.string().min(2, 'Pangkat is required'),
  name: z.string().min(2, 'Name is required'),
  peringkat: z.string().min(1, 'Peringkat is required'),
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
  const params = new URLSearchParams(location.search);
  const dutyPayload = {
    dutyOfficerName: params.get('duty_officer_name') ?? undefined,
    dutyOfficerId: params.get('duty_officer_id') ?? undefined,
    dutyStartedAt: params.get('duty_started_at') ?? undefined,
    dutyEndedAt: params.get('duty_ended_at') ?? undefined
  };
  const submitMovement = useMutation({ mutationFn: api.createPublicMovement, onSuccess: () => setSubmitted(true) });
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!isQRTokenValid(qrState)) {
    return <section className="card space-y-3 text-center"><h2 className="text-xl font-bold">QR Expired</h2><p className="text-sm text-slate-500">Please scan the latest QR shown by the Duty Officer.</p></section>;
  }

  if (submitted) {
    return <section className="card space-y-2 text-center"><h2 className="text-xl font-bold">Outside Movement Checked In</h2><p className="text-sm text-slate-500">Duty Officer has received your outside movement record.</p></section>;
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit((data) => submitMovement.mutate({ ...data, ...dutyPayload, qrToken: qrState?.token }))}>
      <FormHero title="Go Outside Form" description="Fill in your personal and movement details before leaving." remaining={secondsRemaining(qrState!.expiresAt)} />
      <DutyOfficerNotice
        name={dutyPayload.dutyOfficerName}
        id={dutyPayload.dutyOfficerId}
        startedAt={dutyPayload.dutyStartedAt}
        endedAt={dutyPayload.dutyEndedAt}
      />
      <FormSection title="Cadet Details" description="Use your official ROTU/PALAPES details.">
        <FieldShell label="No. Badan" error={errors.bodyNumber?.message}><input className="field" placeholder="Example: 7546001" {...register('bodyNumber')} /></FieldShell>
        <div className="grid grid-cols-2 gap-3">
          <FieldShell label="Pangkat" error={errors.rank?.message}><input className="field" placeholder="CDT" {...register('rank')} /></FieldShell>
          <FieldShell label="Phone" error={errors.phone?.message}><input className="field" inputMode="tel" placeholder="01X-XXXXXXX" {...register('phone')} /></FieldShell>
        </div>
        <FieldShell label="Nama" error={errors.name?.message}><input className="field" placeholder="Full name" {...register('name')} /></FieldShell>
        <FieldShell label="Peringkat" error={errors.peringkat?.message}><select className="field" {...register('peringkat')}><option value="">Select peringkat</option><option>Junior</option><option>Intermediate</option><option>Senior</option></select></FieldShell>
      </FormSection>
      <FormSection title="Movement Details" description="State where you are going and when you expect to return.">
        <FieldShell label="Kenderaan" error={errors.vehicle?.message}><input className="field" placeholder="Car / Motorcycle / Walking" {...register('vehicle')} /></FieldShell>
        <FieldShell label="Destination" error={errors.destination?.message}><input className="field" placeholder="Destination" {...register('destination')} /></FieldShell>
        <FieldShell label="Purpose" error={errors.purpose?.message}><input className="field" placeholder="Purpose" {...register('purpose')} /></FieldShell>
        <FieldShell label="Expected Return" error={errors.expectedReturn?.message}><input className="field" type="time" {...register('expectedReturn')} /></FieldShell>
        <FieldShell label="Remarks"><textarea className="field min-h-28 resize-none" placeholder="Optional remarks" {...register('remarks')} /></FieldShell>
      </FormSection>
      {submitMovement.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to submit. Please inform the Duty Officer.</p>}
      <button className="btn-primary w-full" disabled={submitMovement.isPending}>{submitMovement.isPending ? 'Submitting...' : 'Check In Outside Movement'}</button>
    </form>
  );
}
