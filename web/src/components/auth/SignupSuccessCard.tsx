export default function SignupSuccessCard() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Signup Successful!</h2>
        <p className="mb-4 text-gray-700">
          Your account has been created successfully. Please check your email
          for verification instructions.
        </p>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => (window.location.href = "/auth/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
