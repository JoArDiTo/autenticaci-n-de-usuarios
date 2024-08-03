import app from './config/appConfig';
import { PORT } from './common/constant';

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
