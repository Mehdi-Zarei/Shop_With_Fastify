const emailMessages = {
  resetPassword: (name, resetPasswordToken) => ({
    subject: "Reset Password Link",
    text: `
        <p>سلام ${name} عزیز،</p>
        <p>درخواست تغییر رمز عبور برای حساب کاربری شما ثبت شده است. اگر این درخواست از سمت شما بوده است، لطفاً از طریق لینک زیر اقدام به تغییر رمز عبور خود کنید:</p>
        <a href="http://localhost:${process.env.PORT}/api/v1/auth/reset-password/${resetPasswordToken}">تغییر رمز عبور</a>
        <p>این لینک تا <strong>۱ ساعت</strong> آینده معتبر است. اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید یا با پشتیبانی تماس بگیرید.</p>
        <p>با تشکر،</p>
        <p>تیم پشتیبانی</p>
      `,
  }),
};

module.exports = emailMessages;
